import Hero from './home/Hero'
import About from './home/About'
import Services from './home/Service'
import Portfolio from './home/Portfolio'
import ClientsGrid from './home/Clients'


function page() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <ClientsGrid />
      
      
    </div>
  )
}

export default page