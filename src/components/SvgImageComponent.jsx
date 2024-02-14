import React, { useState } from 'react'
import {
  InspectorControls,
  useBlockProps,
  MediaPlaceholder,
  MediaUpload,
  MediaUploadCheck
} from '@wordpress/block-editor'
import { Button, Icon, PanelBody } from '@wordpress/components'
import { edit as editIcon, trash as trashIcon } from '@wordpress/icons'
import { cleanSvgString } from '../../utils/index.js'
import BCImagePicker from './BCImagePicker.jsx'

const SvgImageComponent = ({
  defaultImageId = null,
  defaultImageUrl = '',
  defaultImageAlt = '',
  onImageChange
}) => {
  const [imageId, setImageId] = useState(defaultImageId)
  const [imageUrl, setImageUrl] = useState(defaultImageUrl)
  const [imageAlt, setImageAlt] = useState(defaultImageAlt)
  const [svgCode, setSvgCode] = useState('')

  const hasImage = imageId && imageUrl
  const isSvg = hasImage && svgCode

  const onRemoveImage = () => {
    setImageId(null)
    setImageUrl('')
    setImageAlt('')
    setSvgCode('')
    onImageChange({ imageId: null, imageUrl: '', imageAlt: '', svgCode: '' })
  }

  const onSelectImage = (media) => {
    setImageId(media.id)
    setImageUrl(media.url)
    setImageAlt(media.alt)

    if (media.mime === 'image/svg+xml') {
      fetch(media.url)
        .then((response) => response.text())
        .then((svgString) => {
          const cleanedSvgString = cleanSvgString(svgString)
          setSvgCode(cleanedSvgString)
          onImageChange({
            imageId: media.id,
            imageUrl: media.url,
            imageAlt: media.alt,
            svgCode: cleanedSvgString
          })
        })
    } else {
      setSvgCode('')
      onImageChange({
        imageId: media.id,
        imageUrl: media.url,
        imageAlt: media.alt,
        svgCode: ''
      })
    }
  }

  return (
    <>
      <InspectorControls>
        <PanelBody title='Image Settings'>
          <BCImagePicker
            imageId={imageId}
            imageUrl={imageUrl}
            imageAlt={imageAlt}
            onSelect={onSelectImage}
            onRemove={onRemoveImage}
          />
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps()}>
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelectImage}
            allowedTypes={['image']}
            value={imageId}
            render={({ open }) =>
              hasImage ? (
                <div className='bc-image-wrapper'>
                  {hasImage &&
                    (isSvg ? (
                      <div
                        className='svg-container'
                        dangerouslySetInnerHTML={{ __html: svgCode }}
                      />
                    ) : (
                      <img src={imageUrl} alt={imageAlt || 'icon'} />
                    ))}

                  <div className='bc-image-wrapper__actions'>
                    <Button
                      className='bc-image-wrapper__btn bc-image-wrapper__replace-btn'
                      type='button'
                      onClick={open}
                    >
                      <Icon
                        icon={editIcon}
                        size={20}
                        className='bc-image-wrapper__btn-icon'
                      />
                    </Button>

                    <Button
                      className='bc-image-wrapper__btn bc-image-wrapper__remove-btn'
                      type='button'
                      onClick={onRemoveImage}
                    >
                      <Icon
                        icon={trashIcon}
                        size={20}
                        className='bc-image-wrapper__btn-icon'
                      />
                    </Button>
                  </div>

                  <div className='bc-image-wrapper__overlay' />
                </div>
              ) : (
                <MediaPlaceholder
                  icon='format-image'
                  onSelect={onSelectImage}
                  allowedTypes={['image', 'image/svg+xml']}
                  labels={{ title: 'Select Icon Image' }}
                />
              )
            }
          />
        </MediaUploadCheck>
      </div>
    </>
  )
}

export default SvgImageComponent
