var FilterableProductTable = React.createClass({
  getInitialState: function() {
    return {
      filterText: '',
      inStockOnly: false
    }
  },

  handleUserInput: function(filterText, inStockOnly) {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  },

  render: function() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}
        />

        <div>React Magic: {this.state.filterText}</div>

        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    )
  }
});

var SearchBar = React.createClass({
  render: function() {
    return (
      <form>
        <input type="text"
          className="textInput"
          ref="filterTextInput"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleChange} />

        <p>
          <input type="checkbox"
          ref="inStockOnlyInput"
          checked={this.props.inStockOnly}
          onChange={this.handleChange} />
          {' '}
          OnlyShow products in Stock.
        </p>
      </form>
    )
  },

  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
      this.refs.inStockOnlyInput.checked
    )
  }
});

var ProductTable = React.createClass({
  render: function() {
    var products = this.props.products,
        filterText = this.props.filterText,
        inStockOnly = this.props.inStockOnly,
        rows = [],
        prevCat;

    products.forEach(function(product) {
      // Filter out unmatched product
      if (!product.name.match(new RegExp(filterText, 'i')) ||
          (inStockOnly && !product.stocked)) {
        return;
      }

      if (product.category !== prevCat) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }

      rows.push(<ProductRow product={product} key={product.name} />);
      prevCat = product.category;
    });

    if (rows.length === 0) {
      rows.push(<tr><td colSpan="2">No records found</td></tr>);
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

// React 0.14: Create stateless component with just a function
// No component instance created, ref would return  null
// No lifecycle methods
// You can set .propTypes and .defaultPropTypes as properties to the function
var ProductCategoryRow = function(props) {
  return (
    <tr>
      <th colSpan="2">{props.category}</th>
    </tr>
  );
};

var ProductRow = function(props) {
  var product = props.product,
      name;

  if (product.stocked) {
    name = product.name;
  } else {
    name = <span style={{color: 'red'}}>{product.name} </span>;
  }

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
};

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('container')
);
