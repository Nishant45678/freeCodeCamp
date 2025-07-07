import { Component } from "react";
import Card from "../../components/Card";
import "./index.css";
import { fetchQuotes, randomQuote } from "../../store/action";
import { connect } from "react-redux";

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFading: false,
    };
  }
  componentDidMount() {
    this.props.fetchQuotes();
  }
  handleNextQuote = () => {
    this.setState({ isFading: true });
    setTimeout(() => {
      this.props.randomQuote();
      this.setState({ isFading: false });
    }, 300);
  };
  render() {
    const { quote, loading, error } = this.props;
    if (loading) return <p>Loading...</p>;
    if (error) return <p> Error: {error}</p>;
    if (!quote) return <p>no quotes available</p>;
    return (
      <Card
        className={`${this.state.isFading ? "fade-out" : "fade-in"}`}
        id="quote-box"
      >
        <div className="Home__quote" id="text">
          {quote.quote}
        </div>
        <div className="Home__author" id="author">
          - {quote.author}
        </div>
        <div className="Home__actions">
          <a
            id="tweet-quote"
            rel="noopener noreference"
            target="_blank"
            href={`https://twitter.com/intent/tweet?hashtags=quotes&related=freeCodeCamp&text${quote.quote}`}
          >
            <img
              id="tweet-svg"
              src="../../../public/Icons/twitter-brands.svg"
              alt="twitter"
            />
          </a>

          <button id="new-quote" onClick={this.handleNextQuote}>
            New Quote
          </button>
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  quote: state.quote.currentQuote,
  loading: state.quote.loading,
  error: state.quote.error,
});

const mapDispatchToProps = {
  fetchQuotes,
  randomQuote,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
