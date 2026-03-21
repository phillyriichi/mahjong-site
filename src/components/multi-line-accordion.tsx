import { Accordion, AccordionItem } from '@heroui/react'
import { Paragraph } from './header'

type MultiLineAccordionProps = {
  title: string
  textlines?: string[]
  variant?: 'splitted' | 'light' | 'shadow' | 'bordered'
}

function MultiLineAccordion(props: MultiLineAccordionProps) {
  return (
    <Accordion variant={props.variant ?? 'light'}>
      <AccordionItem
        key="1"
        aria-label={props.title}
        title={props.title}
        classNames={{
          title: 'text-header-secondary font-semibold'
        }}
      >
        <Paragraph>
          {props.textlines && props.textlines.length > 0 && (
            <ul className="list-disc list-inside">
              {props.textlines.map((line, index) => {
                return <li key={`line-${index}`}>{line}</li>
              })}
            </ul>
          )}
        </Paragraph>
      </AccordionItem>
    </Accordion>
  )
}

export default MultiLineAccordion
