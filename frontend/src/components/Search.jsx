import React from 'react'
import {Form} from 'react-bootstrap';
const Search = () => {
  return (
    <div className="align-center my-3" style={{width:'18rem'}}>
      <Form>
        <Form.Group controlId="search" className="my-3">
          <Form.Control
            type="search"
            placeholder="Search User"
            // onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Search
