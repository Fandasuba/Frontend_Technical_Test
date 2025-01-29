import Component from '@glimmer/component'; /// Ember component class object.
import podNames from 'ember-component-css/pod-names';

export default class MovieListHeader extends Component {
  styleNamespace = podNames['movie-list-header'];
}
