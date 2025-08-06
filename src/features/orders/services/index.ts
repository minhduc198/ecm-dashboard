import { baseDataProvider } from '@/services/dataProvider'
import {
  GetOrdersListRequest,
  GetOrdersListResponse,
  GetOrderDetailRequest,
  GetOrderDetailResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  DeleteOrderRequest,
  DeleteOrderResponse,
  ExportOrdersRequest,
  ExportOrdersResponse,
  Order
} from '../types'

export class OrdersService {
  static async getOrdersList(params: GetOrdersListRequest): Promise<GetOrdersListResponse> {
    const pagination = params.pagination
    try {
      const response = await baseDataProvider.getList('orders', {
        pagination,
        sort: params.sort ?? { field: 'id', order: 'DESC' },
        filter: params.filter ?? {}
      })

      return {
        ...(pagination ?? { page: 1, perPage: 10 }),
        data: response.data as Order[],
        total: response.total || 0
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách orders: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async getOrderDetail(params: GetOrderDetailRequest): Promise<GetOrderDetailResponse> {
    try {
      const response = await baseDataProvider.getOne('orders', { id: params.id })

      return {
        data: response.data as Order
      }
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy chi tiết order ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  static async updateOrder(params: UpdateOrderRequest): Promise<UpdateOrderResponse> {
    try {
      const currentData = await baseDataProvider.getOne('orders', { id: params.id })

      const response = await baseDataProvider.update('orders', {
        id: params.id,
        data: params.data,
        previousData: currentData.data
      })

      return {
        data: response.data as Order
      }
    } catch (error) {
      throw new Error(
        `Lỗi khi cập nhật order ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  static async deleteOrder(params: DeleteOrderRequest): Promise<DeleteOrderResponse> {
    try {
      const currentData = await baseDataProvider.getOne('orders', { id: params.id })

      const response = await baseDataProvider.delete('orders', {
        id: params.id,
        previousData: currentData.data
      })

      return {
        data: response.data as Order
      }
    } catch (error) {
      throw new Error(`Lỗi khi xóa order ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async deleteMany(ids: number[]): Promise<{ data: number[] }> {
    try {
      const response = await baseDataProvider.deleteMany('orders', { ids })

      return {
        data: response.data || []
      }
    } catch (error) {
      throw new Error(`Lỗi khi xóa nhiều orders: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async exportOrdersToExcel(params: ExportOrdersRequest = {}): Promise<ExportOrdersResponse> {
    try {
      const ordersResponse = await OrdersService.getOrdersList({
        pagination: { page: 1, perPage: 1000 }, // Lấy nhiều records để export
        filter: params.filter
      })

      // Chuyển đổi dữ liệu để export
      const exportData = ordersResponse.data.map((order) => ({
        ID: order.id,
        'Mã đơn hàng': order.reference,
        'Ngày đặt': new Date(order.date).toLocaleDateString('vi-VN'),
        'Khách hàng': order.customer,
        'Số sản phẩm': order.basket.length,
        'Tổng tiền (chưa thuế)': order.total_ex_taxes,
        'Phí giao hàng': order.delivery_fees,
        'Thuế suất': `${(order.tax_rate * 100).toFixed(0)}%`,
        'Tiền thuế': order.taxes,
        'Tổng tiền': order.total,
        'Trạng thái': order.status === 'ordered' ? 'Đã đặt' : order.status === 'delivered' ? 'Đã giao' : 'Đã hủy',
        'Đã trả hàng': order.returned ? 'Có' : 'Không'
      }))

      // Tạo CSV content
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map((row) =>
          headers.map((header) => `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n')

      // Tạo blob và URL
      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8'
      })
      const url = URL.createObjectURL(blob)

      const filename = `orders_export_${new Date().toISOString().split('T')[0]}.csv`

      return {
        url,
        filename
      }
    } catch (error) {
      throw new Error(`Lỗi khi export orders: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async getOrdersStats(filter: GetOrdersListRequest['filter'] = {}) {
    try {
      const response = await OrdersService.getOrdersList({
        pagination: { page: 1, perPage: 1000 },
        filter
      })

      const orders = response.data
      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      const statusCounts = orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        statusCounts,
        returnedOrders: orders.filter((order) => order.returned).length
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy thống kê orders: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const fetchOrdersList = (params: GetOrdersListRequest) => OrdersService.getOrdersList(params)

export const fetchOrderDetail = (params: GetOrderDetailRequest) => OrdersService.getOrderDetail(params)

export const updateOrder = (params: UpdateOrderRequest) => OrdersService.updateOrder(params)

export const deleteOrder = (params: DeleteOrderRequest) => OrdersService.deleteOrder(params)

export const deleteOrders = (ids: number[]) => OrdersService.deleteMany(ids)

export const exportOrdersToExcel = (params?: ExportOrdersRequest) => OrdersService.exportOrdersToExcel(params)

export const fetchOrdersStats = (filter?: GetOrdersListRequest['filter']) => OrdersService.getOrdersStats(filter)
