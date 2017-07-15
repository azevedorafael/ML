import React, { Component } from 'react';
import logo from './Logo_ML.png';
import './App.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class App extends Component {
    constructor() {
        // Variável state, herdada de Component, guarda o estado
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
    }
    enviaForm(evento) {
        //Syntatic Event é um evento virtual do React, e não evento do DOM
        evento.preventDefault();
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            contentType: 'application/json',//formato dos dados a serem enviados
            dataType: 'json',//resposta com retorno em json
            type: 'post',//tipos de requisição
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),//dados que vão ser enviados
            success: function (novaListagem) {
                //npm install --save pubsub-js
                //middleware de mensageria
                //disparar aviso geral de novaListagem disponível
                //Publisher quem publica o aviso e Subscriber e quem ouve ou espera pelo aviso
                PubSub.publish('atualiza-lista-autores', novaListagem);
                this.setState({ nome: '', email: '', senha: '' });
                console.log("enviado com sucesso");
            }.bind(this),
            error: function (resposta) {
                if (resposta.status === 400) {
                    //recuperar quais foram os erros
                    //exibir mensagem de erro no campo
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: function () {
                PubSub.publish("limpa-erros", {});
            }
        });
    }

    render() {
        return (
            // <div className="App">
            //   <div className="App-header">
            //     <img src={logo} className="App-logo" alt="logo" />
            //     <input></input>
            //   </div>
            // </div>
            <form onSubmit={this.handleSubmit} className="app">
                <div className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <input className="app-input" type="text" value={this.state.value} onChange={this.handleChange} />
                    <input className="app-inputBtn" type="submit" value="" />
                </div>
            </form>
        );
    }
}

export default App;
