<template>
    <!-- 分页 -->
    <div class="pagination">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.current"
            :page-sizes="page.page_sizes"
            :page-size="page.page_size"
            :total="page.total * 1"
            layout="total,sizes, prev, pager, next"
        ></el-pagination>
    </div>
    <!-- 分页 end -->
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        page: {
            default: () => {
                return {
                    total: 40,
                    current: 1,
                    page_size: 10,
                    size: 0,
                    page_sizes: [15, 30, 45],
                }
            },
            type: Object,
        },
    },
    data() {
        return {}
    },
    methods: {
        handleSizeChange(val) {
            this.page.page_size = val
            this.$emit('onPaging')
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(val) {
            this.page.current = val
            this.$emit('onPaging')
            console.log(`当前页: ${val}`)
        },
    },
}
</script>

<style scoped>
</style>
