import React from 'react'

import EnumRenderer from './EnumRenderer'
import CellarRenderer from './CellarRenderer'
import DateRenderer from './DateRenderer'
import ImageRenderer from './ImageRenderer'

const RENDERERS = {
  bottle: {
    sort: EnumRenderer,
    image: ImageRenderer,
    cellar: CellarRenderer,
    bottlingDate: DateRenderer,
    expirationDate: DateRenderer,
    size: EnumRenderer,
    color: EnumRenderer,
    effervescence: EnumRenderer,
    type: EnumRenderer,
    capsule: EnumRenderer,
    inDate: DateRenderer,
    outDate: DateRenderer,
  },
  log: {
    cellar: CellarRenderer,
    when: DateRenderer,
  },
}

function FieldRenderer({value, name, namespace, ...props}) {
  if (RENDERERS[namespace] && RENDERERS[namespace][name]) {
    const Component = RENDERERS[namespace][name]
    return <Component value={value} name={name} {...props} />
  }

  return value || null
}

export default FieldRenderer
