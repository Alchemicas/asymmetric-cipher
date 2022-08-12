import { ObjectUtils, StoreUtils } from '@queelag/core'
import { InputCollector, InputProps, InputStore, INPUT_PROPS_KEYS, INPUT_STORE_KEYS, ReactUtils, useComponentFormFieldStore } from '@queelag/react-core'
import { useObserver } from '@queelag/state-manager-react'
import React, { ChangeEvent, useEffect } from 'react'

export function TextArea<T extends object>(
  props: InputProps<T> & React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
) {
  const store = useComponentFormFieldStore(InputStore, props as any, InputCollector, INPUT_STORE_KEYS, 'input')

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    store.onChange(e as any)
    props.onChange && props.onChange(e)
  }

  useEffect(() => StoreUtils.updateKeys(store, props, INPUT_STORE_KEYS), ObjectUtils.pickToArray(props, INPUT_STORE_KEYS))

  return useObserver(() => (
    <div className={ReactUtils.joinClassNames('flex flex-col gap-2 p-6 rounded-sm border-2 border-gray-800 bg-black', props.className)}>
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
