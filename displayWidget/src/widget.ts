// Copyright (c) Doris Lee
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel, DOMWidgetView, ISerializers
} from '@jupyter-widgets/base';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

// Import the CSS
import '../css/widget.css'

import * as React from "react";
import * as ReactDOM from "react-dom";

export
class ExampleModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: ExampleModel.model_name,
      _model_module: ExampleModel.model_module,
      _model_module_version: ExampleModel.model_module_version,
      _view_name: ExampleModel.view_name,
      _view_module: ExampleModel.view_module,
      value : 'Hello World'
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
      // Add any extra serializers here
    }

  static model_name = 'ExampleModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ExampleView';   // Set to null if no view
  static view_module = MODULE_NAME;   // Set to null if no view
  
}

export
class ExampleView extends DOMWidgetView {
  initialize(){
    const backbone = this;
    interface AppProps{

    }
    interface AppState{
      value:any
    }
    class Hello extends React.Component<AppProps,AppState> {
      constructor(props:any){
        super(props);
        this.state = {
          value: backbone.model.get("value")
        }
      }

      onChange(model:any){
        this.setState(model.chnaged);
      }
      componentDidMount(){
        backbone.listenTo(backbone.model,"change",this.onChange.bind(this));
      }

      render(){
        console.log(this.state.value);
        // return React.createElement("h1",{},'Hello ${this.state.value}');
        return React.createElement("h1",{},'Hello '+this.state.value);
        // return <h1>Hello {this.state.value}</h1>
      }
    }
    const $app = document.createElement("div");
    const App = React.createElement(Hello);
    ReactDOM.render(App,$app);

    backbone.el.append($app);
  }

  // render() {
  //   this.el.classList.add('custom-widget');

  //   this.value_changed();
  //   this.model.on('change:value', this.value_changed, this);
  // }

  // value_changed() {
  //   this.el.textContent = "bob";//this.model.get('value');
  // }
}