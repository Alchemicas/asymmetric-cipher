import { ObjectUtils } from '@queelag/core'
import { InputCollector, InputProps, InputStore, INPUT_PROPS_KEYS, INPUT_STORE_KEYS, ReactUtils, useComponentFormFieldStore } from '@queelag/react-core'
import { useObserver } from '@queelag/state-manager-react'
import React, { ChangeEvent } from 'react'

export function Input<T extends object>(props: InputProps<T>) {
  const store = useComponentFormFieldStore(InputStore, props, InputCollector, INPUT_STORE_KEYS, 'input')

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    store.onChange(e)
    props.onChange && props.onChange(e)

    console.log(InputCollector.get(store.store, store.path as any))
  }

  return useObserver(() => (
    <div
      className={ReactUtils.joinClassNames(
        'flex items-center space-x-6 p-6 rounded-sm border-2 border-gray-800 bg-black',
        'transition duration-200',
        props.className,
        !props.readOnly && 'hover:border-gray-700 focus:border-gray-700'
      )}
    >
      <div className='flex flex-col flex-1 space-y-2'>
        {props.label && (
          <label className='text-xs uppercase text-gray-400' htmlFor={store.id}>
            {props.label}
            {props.readOnly && ' (read only)'}
          </label>
        )}
        <input
          {...ObjectUtils.omit(props, INPUT_PROPS_KEYS)}
          className={ReactUtils.joinClassNames('bg-transparent placeholder-gray-600', props.readOnly && 'text-purple-600')}
          id={store.id}
          onChange={onChange}
          type={store.lowercaseType}
          value={store.value}
        />
      </div>
      {props.suffix}
    </div>
  ))
}
