import React, { useContext, useEffect, useState } from 'react'
import { Chart } from 'chart.js'
import { ExpenseContext, ProjectContext } from '../../../providers'
import { months } from '../../../constants'

interface Props {
  partner: Partner
  editClick: () => void
  cardClasses?: string[]
  partnershipPartner: boolean
}

export const PartnerCard: React.FC<Props> = ({
  partner,
  editClick,
  cardClasses,
  partnershipPartner
}) => {
  const { projects } = useContext(ProjectContext)
  const { expenses } = useContext(ExpenseContext)
  const [plotData, setPlotData] = useState<number[]>([])
  const [partnershipTotal, setPartnershipTotal] = useState(0)

  useEffect(() => {
    const init = async () => {
      update()
    }
    init()
  }, [])

  const update = () => {
    const canvas = document.getElementById(
      `canvas-${partner.id}`
    ) as HTMLCanvasElement
    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const data = []
    const labels = []

    if (partnershipPartner) {
      const utility = projects
        .filter((project) =>
          project.participants.some(
            (partipation) => partipation.partner === partner.id
          )
        )
        .reduce<number>((acc, project) => {
          return (
            acc +
            ((project.flows
              ? project.flows.reduce<number>((acc, flow) => {
                  return (
                    acc +
                    (flow.amount > 0
                      ? flow.amount
                      : flow.confirmed
                      ? flow.amount
                      : 0)
                  )
                }, 0)
              : 0) *
              (project.participants.find((p) => p.partner === partner.id) as {
                partner: number
                participation: number
              }).participation) /
              100
          )
        }, 0)
      const expense = expenses
        .filter((exp) => {
          return exp.partner === partner.id
        })
        .reduce<number>((acc, exp) => acc + exp.amount, 0)

      setPartnershipTotal(utility - expense)
    }

    for (let i = 11; i >= 0; i--) {
      const month =
        currentMonth - i < 0 ? currentMonth - i + 13 : currentMonth - i + 1
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
      const utility = projects
        .filter((project) =>
          project.participants.some(
            (partipation) => partipation.partner === partner.id
          )
        )
        .reduce<number>((acc, project) => {
          return (
            acc +
            ((project.flows
              ? project.flows
                  .filter((f) => {
                    const flowDate = f.date.split('-')
                    return (
                      flowDate[0] === year.toString() &&
                      flowDate[1] === month.toString()
                    )
                  })
                  .reduce<number>((acc, flow) => {
                    return (
                      acc +
                      (flow.amount > 0
                        ? flow.amount
                        : flow.confirmed
                        ? flow.amount
                        : 0)
                    )
                  }, 0)
              : 0) *
              (project.participants.find((p) => p.partner === partner.id) as {
                partner: number
                participation: number
              }).participation) /
              100
          )
        }, 0)
      const expense = expenses
        .filter((exp) => {
          const expenseDate = exp.date.split('-')
          return (
            expenseDate[0] === year.toString() &&
            expenseDate[1] === month.toString() &&
            exp.partner === partner.id
          )
        })
        .reduce<number>((acc, exp) => acc + exp.amount, 0)
      data.push(utility - expense)
      labels.push(months[month - 1])
    }
    setPlotData(data)
    if (canvasContext) {
      new Chart(canvasContext, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Ganancias',
              data,
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
                  labelString: 'Mes'
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Ganancia'
                }
              }
            ]
          }
        }
      })
    }
  }

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
          <div className="row justify-content-between">
            <div className="card-title">
              {`${partner.name ?? ''} ${partner.last_name ?? ''}`}
            </div>
            {partnershipPartner && (
              <h5>
                <span
                  className={
                    partnershipTotal > 0 ? 'text-success' : 'text-danger'
                  }
                >
                  <i
                    className={`mr-1 fa fa-arrow-${
                      partnershipTotal > 0 ? 'up' : 'down'
                    }`}
                  ></i>
                  {partnershipTotal.toLocaleString('en-cl', {
                    style: 'currency',
                    currency: 'CLP'
                  })}
                </span>
              </h5>
            )}
          </div>
        </div>
      </a>

      <div className="card-body collapse" id={`partner-plot-${partner.id}`}>
        <canvas id={`canvas-${partner.id}`}></canvas>
      </div>
      {!partnershipPartner && !!plotData.length && (
        <div className="card-body">
          <div className="row justify-content-end">
            <h5>
              <span className="mr-2">{`Ganancia mes anterior  `}</span>
              <span
                className={
                  plotData[plotData.length - 2] > 0
                    ? 'text-success'
                    : 'text-danger'
                }
              >
                <i
                  className={`mr-1 fa fa-arrow-${
                    plotData[plotData.length - 2] > 0 ? 'up' : 'down'
                  }`}
                ></i>
                {plotData[plotData.length - 2].toLocaleString('en-cl', {
                  style: 'currency',
                  currency: 'CLP'
                })}
              </span>
            </h5>
          </div>
        </div>
      )}
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
