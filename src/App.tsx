// import AnotherComponent from './AnotherComp.svelte?react';
// import Component from './App.svelte?react';
import { lazy } from 'react';

import './App.css';

const Component = lazy(() => import('./App.svelte?react'));
const AnotherComponent = lazy(() => import('./AnotherComp.svelte?react'));

function App() {
	return (
		<div className='App'>
			<Component duration={1000} initialVal={0.4} callback={() => console.log('Hello world')}>
				Bwhahahhahahahahah
			</Component>

			<AnotherComponent duration={4000} />
		</div>
	);
}

export default App;
