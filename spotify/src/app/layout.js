import "./globals.css";

export const metadata = {
  title: "Spotify Taste Mixer",
  description: "Diseña tu propio setlist musical mezclando eras, estados de ánimo y décadas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
