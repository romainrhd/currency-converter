import React, { Component } from "react";
import axios from "axios";

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
                symbols = res.data.symbols;
                this.setState({symbols})
            });
        axios.get(`http://data.fixer.io/api/latest?access_key=e98157bae73034f3a4cb73185d5eee6a&base=EUR&symbols=${Object.keys(symbols)[0]}`)
            .then(res => {
                const rate = res.data.rates;
                this.setState({currentSymbol: Object.keys(rate)[0], currentRate: rate[Object.keys(rate)]});
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
        const newSymbols = event.target.value;
        if (newSymbols){
            await axios.get(`http://data.fixer.io/api/latest?access_key=e98157bae73034f3a4cb73185d5eee6a&base=EUR&symbols=${newSymbols}`)
                .then(res => {
                    rate = res.data.rates[newSymbols];
                });
            this.setState({currentSymbol: newSymbols, amountConverted: amount * rate, currentRate: rate});
        }
    }

    render() {
        const { amount, amountConverted, currentSymbol, symbols } = this.state;
        return (
            <React.Fragment>
                <input type="number" value={amount} onChange={this.handleChangeAmount} disabled={!currentSymbol}/> EUR
                <select value={currentSymbol} onChange={this.handleChangeSymbol} id="currentSymbol">
                    <option value="0" disabled selected>Choisissez une monnaie</option>
                    { Object.entries(symbols).map(([keySymbol, symbol]) => <option key={keySymbol} value={keySymbol}>{symbol}</option>) }
                </select>
                <p>Nouveau montant: {amountConverted} {currentSymbol}</p>
            </React.Fragment>
        );
    }
}