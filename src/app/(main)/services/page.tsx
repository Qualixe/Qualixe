import PageBanner from "@/components/PageBanner"
import Services from "../home/Service"

function page() {
  return (
    <div className="page-services">
        <PageBanner heading="Services" />
        <div className="page-services-content">
            <Services />
        </div>
    </div>
  )
}

export default page