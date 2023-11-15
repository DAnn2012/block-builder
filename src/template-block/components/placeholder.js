import { Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import ElementorIcon from './elementor-icon';

const ElementorPlaceholder = ( props ) => {
	const {
		withLink = false,
		instructions = '',
		...restProps
	} = props;

	return (
		<Placeholder
			icon={ <ElementorIcon color={ '#93003F' } /> }
			label={ 'Elementor Library' }
			instructions={ instructions }
			{ ...restProps }
		/>
	);
}

export default ElementorPlaceholder;
