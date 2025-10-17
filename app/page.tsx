import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SimpleSearchPage } from "@/components/simple-search-page"

export default async function IndexPage() {
  return (
    <>
      <Header active="/" />
      <SimpleSearchPage />
      <Footer />
    </>
  )
}
