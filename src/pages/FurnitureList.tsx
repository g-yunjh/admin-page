import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Plus, Eye, Edit, Trash2, Package } from 'lucide-react'
import { furniture, type Furniture, type FurnitureFilters } from '../lib/furniture'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const FurnitureList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [furnitureList, setFurnitureList] = useState<Furniture[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FurnitureFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  const conditionLabels = {
    new: '새상품',
    like_new: '거의 새것',
    good: '양호',
    fair: '보통',
    poor: '나쁨'
  }

  useEffect(() => {
    fetchFurniture()
  }, [currentPage, filters])

  const fetchFurniture = async () => {
    try {
      setLoading(true)
      const response = await furniture.getAll(filters, { page: currentPage, limit: 10 })
      setFurnitureList(response.data)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Failed to fetch furniture:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof FurnitureFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 가구를 삭제하시겠습니까?')) return

    try {
      await furniture.delete(id)
      fetchFurniture()
    } catch (error) {
      console.error('Failed to delete furniture:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const handleToggleSold = async (id: string, currentStatus: boolean) => {
    try {
      await furniture.update(id, { is_sold: !currentStatus })
      fetchFurniture()
    } catch (error) {
      console.error('Failed to update furniture:', error)
      alert('상태 변경에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">가구 관리</h2>
          <p className="text-gray-600">등록된 가구 목록을 관리합니다.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="가구명으로 검색..."
                className="input-field pl-10"
                onChange={(e) => handleFilterChange('title', e.target.value || undefined)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              필터
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">판매 상태</label>
                <select
                  className="select-field"
                  value={filters.is_sold === undefined ? '' : filters.is_sold.toString()}
                  onChange={(e) => handleFilterChange('is_sold', e.target.value === '' ? undefined : e.target.value === 'true')}
                >
                  <option value="">전체</option>
                  <option value="false">판매중</option>
                  <option value="true">판매완료</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상품 상태</label>
                <select
                  className="select-field"
                  value={filters.condition || ''}
                  onChange={(e) => handleFilterChange('condition', e.target.value || undefined)}
                >
                  <option value="">전체</option>
                  {Object.entries(conditionLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                <input
                  type="text"
                  placeholder="지역명 입력..."
                  className="input-field"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Furniture List */}
      <div className="space-y-4">
        {furnitureList.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 가구가 없습니다</h3>
            <p className="text-gray-600">새로운 가구가 등록되면 여기에 표시됩니다.</p>
          </div>
        ) : (
          furnitureList.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start space-x-4">
                {item.images.length > 0 && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{item.price.toLocaleString()}원</span>
                        <span>{conditionLabels[item.condition]}</span>
                        <span>{item.location}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.is_sold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.is_sold ? '판매완료' : '판매중'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleSold(item.id, item.is_sold)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          item.is_sold 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.is_sold ? '판매중으로' : '판매완료로'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">
                      {format(new Date(item.created_at), 'yyyy.MM.dd HH:mm', { locale: ko })}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/furniture/${item.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

export default FurnitureList
