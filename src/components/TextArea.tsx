import { ObjectUtils, StoreUtils } from '@queelag/core'
import { InputProps, InputStore, INPUT_PROPS_KEYS, INPUT_STORE_KEYS, ReactUtils, useForceUpdate, useObserver } from '@queelag/react-core'
import React, { useEffect, useMemo } from 'react'

export function TextArea<T extends object>(
  props: InputProps<T> & React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
) {
  const update = useForceUpdate()
  const store = useMemo(() => new InputStore({ ...props, update }), [])

  const onChange = (e) => {
    store.onChange(e)
    props.onChange && props.onChange(e)
  }

  useEffect(() => StoreUtils.updateKeys(store, props, INPUT_STORE_KEYS), ObjectUtils.pickToArray(props, INPUT_STORE_KEYS))

  return useObserver(() => (
    <div className={ReactUtils.joinClassNames('flex flex-col gap-2 p-6 rounded-sm border-2 border-gray-800', props.className)}>
      {props.label && (
        <label className='text-xs uppercase text-gray-400' htmlFor={store.id}>
          {props.label}
          {props.readOnly && ' (read only)'}
        </label>
      )}
      <textarea
        {...ObjectUtils.omit(props, INPUT_PROPS_KEYS)}
        className={ReactUtils.joinClassNames('bg-transparent placeholder-gray-600 resize-none', props.readOnly && 'text-purple-600')}
        id={store.id}
        onChange={onChange}
        value={store.value}
      />
    </div>
  ))
}
