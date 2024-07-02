import React from 'react';

import './UserSettingsFormItem.scss';

function UserSettingsFormItem(props) {
  return (
    <div className='user-settings-form'>
        <div className='form-item'>
          <label className='form-label'>
            <div className='form-label-content'>
              <span className='label-text'>{props.settingsField}</span>
              <span className='arrow'>&#8250;</span>
            </div>
          </label>
        </div>
      </div>
  )
}

export default UserSettingsFormItem;