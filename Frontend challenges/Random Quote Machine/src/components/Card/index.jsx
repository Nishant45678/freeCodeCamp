import { Component } from 'react'
import './index.css'

export default class Card extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div className={`Card__body  ${this.props.className}`} id={this.props.id}>
        {this.props.children}
      </div>
    )
  }
}
