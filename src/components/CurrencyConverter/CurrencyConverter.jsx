import React, { Component } from "react";
import axios from "axios";
import Select from 'react-select';

export class CurrencyConverter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            symbols: {},
            amountConverted: 0,
            currentSymbol: null,
            currentRate: 0
        };
        this.handleChangeAmount = this.handleChangeAmount.bind(this);
        this.handleChangeSymbol = this.handleChangeSymbol.bind(this);
    }

    async componentDidMount() {
        let symbols = {};
        await axios.get('http://data.fixer.io/api/symbols?access_key=e98157bae73034f3a4cb73185d5eee6a')
            .then(res => {
                symbols = Object.entries(res.data.symbols).map(([keySymbol, symbol]) => {
                    return {
                        value: keySymbol,
                        label: symbol
                    };
                });
                this.setState({symbols})
            });
    }

    handleChangeAmount(event) {
        const newAmount = event.target.value;
        const { currentRate } = this.state;
        if (newAmount && currentRate){
            this.setState({amount: newAmount, amountConverted: newAmount * currentRate});
        } else {
            this.setState({amount: newAmount, amountConverted: newAmount});
        }
    }

    async handleChangeSymbol(event) {
        const { amount } = this.state;
        let rate = 0;
        const newSymbols = event;
        if (newSymbols){
            await axios.get(`http://data.fixer.io/api/latest?access_key=e98157bae73034f3a4cb73185d5eee6a&base=EUR&symbols=${newSymbols.value}`)
                .then(res => {
                    rate = res.data.rates[newSymbols.value];
                });
            this.setState({currentSymbol: newSymbols, amountConverted: amount * rate, currentRate: rate});
        }
    }

    render() {
        const { amount, amountConverted, currentSymbol, symbols } = this.state;
        return (
            <React.Fragment>
                <input type="number" value={amount} onChange={this.handleChangeAmount} disabled={!currentSymbol}/> EUR
                <Select
                    value={currentSymbol}
                    onChange={this.handleChangeSymbol}
                    options={symbols}
                />
                <p>Nouveau montant: {amountConverted} {currentSymbol ? currentSymbol.value : ''}</p>
            </React.Fragment>
        );
    }
}