import { ReactNode } from "react";


export default function MarketingLayout({ children }:{children:ReactNode}) {
  return (
    <><div className="dark:bg-black">
      <main>{children}</main>
      </div>
    </>
  )
}