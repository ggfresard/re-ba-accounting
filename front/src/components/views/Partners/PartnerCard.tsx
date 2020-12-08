import React, { useEffect } from 'react'
import { Chart } from 'chart.js'

interface Props {
  partner: Partner
  editClick: () => void
  cardClasses?: string[]
}

export const PartnerCard: React.FC<Props> = ({
  partner,
  editClick,
  cardClasses
}) => {
  useEffect(() => {
    const context = (document.getElementById(
      `canvas-${partner.id}`
    ) as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
    new Chart(context, {
      type: 'line',
      data: {
        labels: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre'
        ],
        datasets: [
          {
            label: 'Ganancias',
            data: [
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000),
              Math.floor(Math.random() * 1000000 - 500000)
            ],
            backgroundColor: '#5cb85c',
            borderColor: '#5cb85c',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Value'
              }
            }
          ]
        }
      }
    })
  }, [])

  return (
    <div
      className={`card card-outline ${
        cardClasses ? cardClasses.reduce((acc, curr) => acc + ` ${curr}`) : ''
      }`}
      key={partner.id}
    >
      <a
        data-toggle="collapse"
        href={`#partner-plot-${partner.id}`}
        role="button"
        aria-expanded="false"
        aria-controls={`partner-plot-${partner.id}`}
        style={{
          textDecoration: 'inherit',
          color: 'inherit'
        }}
      >
        <div
          className="card-header"
          style={{ cursor: 'pointer', transition: 'all 1' }}
        >
          <div className="card-title">
            {`${partner.name ?? ''} ${partner.last_name ?? ''}`}
          </div>
        </div>
      </a>

      <div className="card-body collapse" id={`partner-plot-${partner.id}`}>
        <canvas id={`canvas-${partner.id}`}></canvas>
      </div>
      <div className="card-footer">
        <button
          type="button"
          className="btn bg-gradient-info  float-right"
          data-toggle="modal"
          data-target="#newPartner"
          onClick={editClick}
        >
          <i className="fa fa-edit" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  )
}
