import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { HiFilter } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { categoryListSelector } from '../../../redux/selectors/category/category.selector';

import './style.css';

export default function FilterButtonCategory(props) {
  const [checkAll, setCheckAll] = useState(true);
  const handleFilter = (value) => {
    if (value == 0) {
      setCheckAll(true);
      props.setCurrentFilter(0);
    } else {
      setCheckAll(false);
      props.setCurrentFilter(value);
    }
  };
  var categoryCheck = checkAll ? [0] : props.currentFilter;
  if (categoryCheck == '') {
    setCheckAll(true);
  }
  const [...listCategory] = useSelector(categoryListSelector);
  return (
    <Dropdown id="asset-filter-category">
      <Dropdown.Toggle
        id="asset-filter-category-btn"
        className="d-flex filter-button btn-asset align-items-center justity-content-center btn btn-primary asset_filter"
      >
        <p className="flex-grow-1 afd-name font-weight-bold">Category</p>
        <div className="fb-icon">
          <HiFilter />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu id="asset-filter-category-menu" style={{ maxHeight: '248px', overflowY: 'auto' }}>
        <Form>
          <Dropdown.Item onClick={() => handleFilter(0)}>
            <Form.Check
              type="checkbox"
              id="checkbox-all-cate"
              className="mx-4 font-weight-bold"
              label="All"
              checked={checkAll ? true : false}
              onChange={() => handleFilter(0)}
            />
          </Dropdown.Item>
          {listCategory.map((item, index) => {
            return (
              <Dropdown.Item key={index} onClick={() => handleFilter(item.id)}>
                <Form.Check
                  type="checkbox"
                  className="mx-4 font-weight-bold"
                  data-category={item.id}
                  id={`cateid_${item.id}`}
                  checked={categoryCheck.indexOf(item.id) == -1 ? false : true}
                  label={item.category_name}
                  onChange={() => handleFilter(item.id)}
                  style={{ whiteSpace: 'break-spaces' }}
                />
              </Dropdown.Item>
            );
          })}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

FilterButtonCategory.propTypes = {
  currentFilter: PropTypes.any,
  setCurrentFilter: PropTypes.func,
};
