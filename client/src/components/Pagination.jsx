import React from 'react'

const Pagination = ({perPage, total, paginate}) => {
  const pageNumbers = []
  for(let i = 1; i<= Math.ceil(total / perPage); i++){
    pageNumbers.push(i)
  }
  const fun = (e, num) => {
    e.preventDefault()
    paginate(num)
  }
  return (
    <div className='pag-div'>
      <ul className="pagination">
        {pageNumbers.map(num => (
          <a href={num} className="page" key={num} onClick={(e) => fun(e,num)}>
            <li className="page-link">
              {num}
            </li>
          </a>
        ))}
      </ul>
    </div>
  )
}

export default Pagination