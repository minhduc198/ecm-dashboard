import CustomTable from '@/components/CustomTable'
import { useContext } from 'react'
import { FilterContext } from '../context/FilterContext'

const Delivered = () => {
  const { columnSetting, activeTab } = useContext(FilterContext)

  // return <CustomTable size='medium' dataColumn={columnSetting[activeTab]} />
  return null
}

export default Delivered
