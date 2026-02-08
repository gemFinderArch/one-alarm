// Register background task at module level (before component registration)
import './src/tasks/recalculate-alarm';

import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
