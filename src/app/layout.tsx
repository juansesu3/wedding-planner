import NavBar from "./components/NavBar";
import "./globals.css";

export const metadata = {
  title: 'Wedding Planner',
  icons: [
    { rel: 'apple-touch-icon', sizes: '120x120', url: '/icons/apple-touch-icon-120x120.png' },
    { rel: 'apple-touch-icon', sizes: '120x120', url: '/icons/apple-touch-icon-120x120-precomposed.png' },
    { rel: 'apple-touch-icon', url: '/icons/apple-touch-icon.png' }
  ],
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NavBar>
 
        {children}
        </NavBar>
        </body>
    </html>
  );
}
