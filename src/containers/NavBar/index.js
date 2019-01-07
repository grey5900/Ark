/**
 * Created by isaac on 2/24/16.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {logout} from 'redux/modules/auth';
import {Dropdown} from 'stardust';

const wrapper = {
  height: '60px',
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid rgba(230,230,230,0.7)'
};
const dropdown = {
  marginTop: '22px',
  marginRight: '40px'
};

@connect(
  state => ({user: state.auth.user}),
  {logout})
export default
class NavBar extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired
  };

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const {user} = this.props;
    let result = null;
    if (user) {
      result = (
        <div style={wrapper} >
          <div className="pull-right" style={dropdown} >
            <Dropdown text={user.name || '管理员'}>
              <Dropdown.Menu>
                <Dropdown.Item text="登出" onClick={this.handleLogout} />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      );
    }
    return result;
  }
}
