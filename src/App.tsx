// import AnotherComponent from './AnotherComp.svelte?react';
// import Component from './App.svelte?react';
import { lazy, useEffect, useState } from 'react';

import './App.css';

const Component = lazy(() => import('./App.svelte?react'));
const AnotherComponent = lazy(() => import('./AnotherComp.svelte?react'));

function App() {
	const [value, setValue] = useState(0);

	useEffect(() => {
		console.log(value);
	}, [value]);

	return (
		<div className='App'>
			<button onClick={() => setValue((v) => v + 1)}> Increemtn </button>

			<Component
				duration={1000}
				initialVal={0.4}
				callback={() => console.log('Hello world')}
				value={value}
			>
				Bwhahahhahahahahah
			</Component>

			<AnotherComponent duration={4000} />
		</div>
	);
}

export default App;
