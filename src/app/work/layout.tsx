import Navbar from '@/components/Navbar'

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar theme="dark" />
      {children}
    </>
  )
}
