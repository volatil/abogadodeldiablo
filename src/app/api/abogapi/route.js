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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  let response;

  try {
    response = await fetch(url, {
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
  } catch (error) {
    console.error("[abogapi] Error conectando con Gemini:", error);
    return responderError("No fue posible conectar con Gemini.", 502);
  }

  let data;

  try {
    data = await response.json();
  } catch {
    return responderError("Gemini devolvio una respuesta que no es JSON valido.", 502);
  }

  if (!response.ok || data.error) {
    const apiMessage = data.error?.message || "Gemini rechazo la solicitud.";
    console.error("[abogapi] Gemini error:", apiMessage);
    return responderError(`Gemini rechazo la solicitud: ${apiMessage}`, response.status || 502);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("[abogapi] Respuesta sin texto:", data);
    return responderError("La API no devolvio una respuesta valida.", 502);
  }

  return NextResponse.json({
    respuesta: limpiarRespuestaGemini(text),
  });
}
