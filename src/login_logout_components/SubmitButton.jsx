import React from 'react';

class SubmitButton extends React.Component{

    render(){
        return(
                <button
                    className='submitButton'
                    disabled={this.props.disabled}
                    onClick={()=>this.props.onClick()}
                >    
                    {this.props.text}
                </button>
        );
    }
}

export default SubmitButton;