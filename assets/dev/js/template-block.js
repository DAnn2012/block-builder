import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/editor';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	Button,
	PanelBody,
	SelectControl,
} from '@wordpress/components';

import { ElementorPreviewIFrame } from './components/preview-frame';
import { ElementorIcon } from './components/elementor-icon';
import { ElementorPlaceholder } from './components/placeholder';

registerBlockType( 'elementor/template', {
	title: __( 'Elementor', 'block-builder' ),
	icon: ElementorIcon,
	description: __( 'Build your Gutenberg Blocks using Elementor', 'block-builder' ),
	category: 'common',
	attributes: {
		selectedTemplate: {
			type: 'number',
			default: 0,
		},
		title: {
			type: 'string',
			default: '',
		},
	},

	// Defines the block within the editor.
	edit: withSelect( ( select ) => {
		const { getEntityRecords } = select( 'core' );

		return {
			templates: getEntityRecords( 'postType', 'elementor_library', { per_page: 100 } ),
		};
	} )( ( props ) => {
		if ( ! props.templates ) {
			return (
				<div className={ props.className }>
					<ElementorPlaceholder>
						{ __( 'Loading..', 'block-builder' ) }
					</ElementorPlaceholder>
				</div>
			);
		}

		if ( 0 === props.templates.length ) {
			return (
				<div className={ props.className }>
					<ElementorPlaceholder>
						<Button
							isDefault
							target="_blank"
							href={ elementorBlockBuilderConfig.create_new_post_url }>
							{ __( 'Create Your First Template', 'block-builder' ) }
						</Button>
					</ElementorPlaceholder>
				</div>
			);
		}

		const template = props.attributes.selectedTemplate,
			templates = [ {
				value: 0,
				label: '— ' + __( 'Select a Template', 'block-builder' ) + ' —',
			} ],
			className = props.className;

		let editWithElementor = '',
			display = '';

		const templateSelectControl = (
			<SelectControl
				value={ props.attributes.selectedTemplate }
				onChange={ ( value ) => props.setAttributes( { selectedTemplate: parseInt( value ) } ) }
				options={ templates }
			/>
		);

		if ( props.templates.length > 0 ) {
			props.templates.forEach( ( p ) => {
				templates.push( {
					label: p.title.rendered,
					value: p.id,
				} );

				if ( template === p.id ) {
					props.setAttributes( {
						selectedTemplate: parseInt( p.id ),
						title: p.title.rendered,
					} );

					editWithElementor = (
						<Button
							isDefault
							target={ '_blank' }
							href={ elementorBlockBuilderConfig.edit_url_pattern + p.id }
						>
							{ __( 'Edit Template with Elementor', 'block-builder' ) }
						</Button>
					);

					display = (
						<div
							id={ 'elementor-template-block-inner-' + p.id }
						>
							<ElementorPreviewIFrame
								srcDoc={ elementorBlockBuilderConfig.preview_url_pattern + p.id }
								id={ 'elementor-template-' + p.id }
								templateId={ p.id }
								className={ 'elementor-block-preview-frame' }
							/>
						</div>
					);
				}
			} );
		}

		if ( '' === display ) {
			display = (
				<ElementorPlaceholder>
					{ templateSelectControl }
				</ElementorPlaceholder>
			);
		}

		const inspectorPanel = (
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Elementor Settings', 'block-builder' ) } initialOpen={ true }>
					{ templateSelectControl }
					{ editWithElementor }
				</PanelBody>
			</InspectorControls>
		);

		return (
			<div className={ className }>
				{ inspectorPanel }
				{ display }
			</div>
		);
	} ),

	save() {
		return null;
	},
} );
