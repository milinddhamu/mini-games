
import './globals.css'
import {Providers} from "./providers";
import {Button} from "@nextui-org/button";
import Topbar from "@/Components/Topbar";

export const metadata = {
  title: 'Online Mini Games',
  description: 'TicTacToe, Rock Paper Scissors etc..',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Topbar />
          {children}
        </Providers>
        </body>
    </html>
  )
}
