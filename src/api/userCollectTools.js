import service from '@/utils/request'

// @Tags UserCollectTools
// @Summary 创建UserCollectTools
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.UserCollectTools true "创建UserCollectTools"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /userCollectTools/createUserCollectTools [post]
export const createUserCollectTools = (data) => {
  return service({
    url: '/userCollectTools/createUserCollectTools',
    method: 'post',
    data
  })
}

// @Tags UserCollectTools
// @Summary 删除UserCollectTools
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.UserCollectTools true "删除UserCollectTools"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /userCollectTools/deleteUserCollectTools [delete]
export const deleteUserCollectTools = (data) => {
  return service({
    url: '/userCollectTools/deleteUserCollectTools',
    method: 'delete',
    data
  })
}

// @Tags UserCollectTools
// @Summary 删除UserCollectTools
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除UserCollectTools"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /userCollectTools/deleteUserCollectTools [delete]
export const deleteUserCollectToolsByIds = (data) => {
  return service({
    url: '/userCollectTools/deleteUserCollectToolsByIds',
    method: 'delete',
    data
  })
}

// @Tags UserCollectTools
// @Summary 更新UserCollectTools
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.UserCollectTools true "更新UserCollectTools"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /userCollectTools/updateUserCollectTools [put]
export const updateUserCollectTools = (data) => {
  return service({
    url: '/userCollectTools/updateUserCollectTools',
    method: 'put',
    data
  })
}

// @Tags UserCollectTools
// @Summary 用id查询UserCollectTools
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query model.UserCollectTools true "用id查询UserCollectTools"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /userCollectTools/findUserCollectTools [get]
export const findUserCollectTools = (params) => {
  return service({
    url: '/userCollectTools/findUserCollectTools',
    method: 'get',
    params
  })
}

// @Tags UserCollectTools
// @Summary 分页获取UserCollectTools列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取UserCollectTools列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /userCollectTools/getUserCollectToolsList [get]
export const getUserCollectToolsList = (params) => {
  return service({
    url: '/userCollectTools/getUserCollectToolsList',
    method: 'get',
    params
  })
}
