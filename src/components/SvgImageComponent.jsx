import React, { useState } from 'react';
import {
  InspectorControls,
  useBlockProps,
  MediaUpload,
  MediaUploadCheck,
  MediaPlaceholder
} from '@wordpress/block-editor';
import { Button, Icon, PanelBody } from '@wordpress/components';
import { edit as editIcon, trash as trashIcon } from '@wordpress/icons';
import useImageHandler from '../utils/useImageHandler';
import BCImagePicker from './BCImagePicker';

const SvgImageComponent = ({
  defaultImageId = null,
  defaultImageUrl = '',
  defaultImageAlt = '',
  onImageChange
}) => {
  const defaultValues = { defaultImageId, defaultImageUrl, defaultImageAlt };
  const { imageData, onSelectImage, onRemoveImage } = useImageHandler(defaultValues, onImageChange);

  const hasImage = imageData.imageId && imageData.imageUrl;
  const isSvg = hasImage && imageData.svgCode;

  return (
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelectImage}
            allowedTypes={['image']}
            value={imageData.imageId}
            render={({ open }) => (
              hasImage ? (
                <div className='bc-image-wrapper'>
                  {isSvg ? (
                    <div
                      className='svg-container'
                      dangerouslySetInnerHTML={{ __html: imageData.svgCode }}
                    />
                  ) : (
                    <img src={imageData.imageUrl} alt={imageData.imageAlt || 'icon'} />
                  )}

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
            )}
          />
        </MediaUploadCheck>
  );
};

export default SvgImageComponent;
