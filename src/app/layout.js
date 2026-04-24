import "./globals.css";

export const metadata = {
  title: "Abogado del Diablo",
  description: "Espacio de analisis critico y defensa de ideas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
