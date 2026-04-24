import { NextResponse } from "next/server";

const CAMPOS = [
  "titulo",
  "descripcion",
  "publico_objetivo",
  "problema",
  "solucion",
  "modelo_de_negocio",
  "competencia_conocida",
  "etapa",
];

const MODELOS_GEMINI = ["gemini-2.5-flash", "gemini-2.0-flash"];

function limpiarCampo(valor) {
  return String(valor ?? "").trim();
}

function limpiarRespuestaGemini(texto) {
  return texto
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function construirPrompt(input) {
  const campos = CAMPOS.reduce((acc, campo) => {
    acc[campo] = limpiarCampo(input[campo]);
    return acc;
  }, {});

  return `
Actua como un evaluador critico de ideas de negocio y software.
Tu rol es ser un "abogado del diablo": no debes motivar al usuario ni validar su idea automaticamente.
Debes encontrar debilidades, riesgos, supuestos ocultos, contradicciones y preguntas dificiles.

Analiza la siguiente idea:

Titulo:
${campos.titulo}

Descripcion:
${campos.descripcion}

Publico objetivo:
${campos.publico_objetivo}

Problema:
${campos.problema}

Solucion:
${campos.solucion}

Modelo de negocio:
${campos.modelo_de_negocio}

Competencia conocida:
${campos.competencia_conocida}

Etapa:
${campos.etapa}

Devuelve solamente JSON valido, sin markdown, sin comentarios y sin texto adicional.
Usa comillas dobles en todas las claves y strings.
La estructura exacta debe ser:

{
  "resumen": "",
  "diagnostico": "",
  "supuestos_debiles": [],
  "riesgos": [
    {
      "titulo": "",
      "descripcion": "",
      "severidad": "baja|media|alta|critica",
      "categoria": "comercial|tecnica|financiera|operativa|legal|producto|marketing",
      "recomendacion": ""
    }
  ],
  "preguntas_incomodas": [
    {
      "pregunta": "",
      "motivo": ""
    }
  ],
  "experimentos_validacion": [
    {
      "titulo": "",
      "descripcion": "",
      "dificultad": "baja|media|alta",
      "tiempo_estimado": "",
      "metrica_exito": ""
    }
  ],
  "scores": {
    "viabilidad": 0,
    "riesgo_comercial": 0,
    "riesgo_tecnico": 0,
    "diferenciacion": 0
  },
  "veredicto": ""
}

Se directo, critico y util.
No uses frases genericas.
No digas que la idea es buena si no hay evidencia.
`.trim();
}

function responderError(error, status = 500) {
  return NextResponse.json({ error }, { status });
}

function formatearErrorGemini(message, status) {
  if (status === 429) {
    const retryMatch = message.match(/Please retry in ([^.]+(?:\.\d+)?s)/i);
    const retryText = retryMatch ? ` Reintenta en ${retryMatch[1]}.` : "";

    return (
      "La API key de Gemini no tiene cuota disponible para este modelo o proyecto." +
      " Revisa el plan, billing o limites de uso en Google AI Studio." +
      retryText
    );
  }

  return `Gemini rechazo la solicitud: ${message}`;
}

async function consultarGemini({ apiKey, modelo, prompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw {
      status: 502,
      message: "Gemini devolvio una respuesta que no es JSON valido.",
    };
  }

  return {
    data,
    modelo,
    ok: response.ok && !data.error,
    status: response.status,
  };
}

export async function POST(request) {
  let input;

  try {
    input = await request.json();
  } catch {
    return responderError("La solicitud no contiene JSON valido.", 400);
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return responderError("La solicitud no contiene JSON valido.", 400);
  }

  const apiKey = String(process.env.GEMINI_API_KEY ?? "").trim();

  if (!apiKey) {
    return responderError("Falta configurar GEMINI_API_KEY.", 500);
  }

  const prompt = construirPrompt(input);
  let resultado;
  let ultimoError;

  for (const modelo of MODELOS_GEMINI) {
    try {
      resultado = await consultarGemini({ apiKey, modelo, prompt });
    } catch (error) {
      console.error(`[abogapi] Error conectando con Gemini (${modelo}):`, error);
      ultimoError = {
        message: error.message || "No fue posible conectar con Gemini.",
        status: error.status || 502,
      };
      break;
    }

    if (resultado.ok) {
      break;
    }

    const apiMessage =
      resultado.data.error?.message || "Gemini rechazo la solicitud.";
    ultimoError = {
      message: apiMessage,
      status: resultado.status || 502,
    };

    if (resultado.status !== 503 || modelo === MODELOS_GEMINI.at(-1)) {
      break;
    }

    console.warn(
      `[abogapi] ${modelo} respondio 503. Reintentando con modelo fallback.`
    );
  }

  if (!resultado?.ok) {
    const message = ultimoError?.message || "Gemini rechazo la solicitud.";
    const status = ultimoError?.status || 502;
    console.error("[abogapi] Gemini error:", message);
    return responderError(formatearErrorGemini(message, status), status);
  }

  const text = resultado.data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("[abogapi] Respuesta sin texto:", resultado.data);
    return responderError("La API no devolvio una respuesta valida.", 502);
  }

  return NextResponse.json({
    respuesta: limpiarRespuestaGemini(text),
  });
}
