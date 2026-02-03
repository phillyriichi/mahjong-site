import { useEffect } from 'react'
import { PageHeader } from '../components/header'
import Page from '../components/page'
import ConstrainedDiv from '../components/constrained-div'
import Section from '../components/section'

const Gallery = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://www.juicer.io/embed/phillyriichi/embed-code.js?per=15?overlay=true'
    script.async = true
    script.defer = true

    // Append the script to the document body
    document.body.appendChild(script)

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script)
    }
  }, [])
  return (
    <Page title="Gallery - Philly Mah-Jawn Mahjong Club">
      <Section>
        <ConstrainedDiv>
          <PageHeader text="Gallery" />
          <ul className="juicer-feed" data-feed-id="phillyriichi" />
        </ConstrainedDiv>
      </Section>
    </Page>
  )
}

export default Gallery
