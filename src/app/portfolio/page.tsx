import PageBanner from "@/components/PageBanner"
import Portfolio from "../home/Portfolio"
import './portfolio.css'
function page() {
  return (
    <div className="page-portfolio">
        <PageBanner heading="Portfolio" />
        <div className="page-portfolio-content">
            <Portfolio />
        </div>
    </div>
  )
}

export default page