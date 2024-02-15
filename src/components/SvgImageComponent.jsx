import React from 'react';
import {
  InspectorControls,
  useBlockProps,
  MediaPlaceholder,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button, Icon, PanelBody } from '@wordpress/components';
import { edit as editIcon, trash as trashIcon } from '@wordpress/icons';
import BCImagePicker from './BCImagePicker.jsx';
import cleanSvgString from '../utils/cleanSvgString.js';

const SvgImageComponent = ({ imageId, imageUrl, imageAlt, svgCode, setAttributes }) => {
    const hasImage = imageId && imageUrl;
    const isSvg = hasImage && svgCode;

    const onRemoveImage = () => setAttributes({
        imageId: null,
        imageUrl: '',
        imageAlt: '',
        svgCode: '',
    });

    const onSelectImage = (media) => {
        setAttributes({
            imageId: media.id,
            imageUrl: media.url,
            imageAlt: media.alt,
        });

        if (media.mime === 'image/svg+xml') {
            fetch(media.url)
                .then(response => response.text())
                .then(svgString => {
                    const cleanedSvgString = cleanSvgString(svgString);
                    setAttributes({ svgCode: cleanedSvgString });
                });
        } else {
            setAttributes({ svgCode: '' });
        }
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Image Settings">
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
                        render={({ open }) => (
                            hasImage ?
                                <ImageDisplay
                                    isSvg={isSvg}
                                    svgCode={svgCode}
                                    imageUrl={imageUrl}
                                    imageAlt={imageAlt}
                                    open={open}
                                    onRemoveImage={onRemoveImage}
                                />
                            :
                                <MediaPlaceholder
                                    icon="format-image"
                                    onSelect={onSelectImage}
                                    allowedTypes={['image', 'image/svg+xml']}
                                    labels={{ title: 'Icon Image' }}
                                />
                        )}
                    />
                </MediaUploadCheck>
            </div>
        </>
    );
};

const ImageDisplay = ({ isSvg, svgCode, imageUrl, imageAlt, open, onRemoveImage }) => (
    <div className="bc-image-wrapper">
        {isSvg ? (
            <div className="svg-container" dangerouslySetInnerHTML={{ __html: svgCode }} />
        ) : (
            <img src={imageUrl} alt={imageAlt || "icon"} />
        )}
        <div className="bc-image-wrapper__actions">
            <Button className="bc-image-wrapper__btn bc-image-wrapper__replace-btn" onClick={open}>
                <Icon icon={editIcon} size={20} className="bc-image-wrapper__btn-icon" />
            </Button>
            <Button className="bc-image-wrapper__btn bc-image-wrapper__remove-btn" onClick={onRemoveImage}>
                <Icon icon={trashIcon} size={20} className="bc-image-wrapper__btn-icon" />
            </Button>
        </div>
        <div className="bc-image-wrapper__overlay" />
    </div>
);

export default SvgImageComponent
