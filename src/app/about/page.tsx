import PageBanner from "@/components/PageBanner"
import About from "../home/About"
import ClientsGrid from "../home/Clients"

function page() {
  return (
    <div className="about-page">
      <PageBanner heading="About Us" />
      <div className="about-page-content">
       <About />
       <ClientsGrid />

      </div>
    </div>
  )
}

export default page