import axiosClient from "../axios";

export function getCurrentUser({commit}, data) {
  return axiosClient.get('/user', data)
    .then(({data}) => {
      commit('setUser', data);
      return data;
    })
}

export function login({commit}, data) {
  return axiosClient.post('/v1/login', data)
    .then(({data}) => {
      commit('setUser', data.user);
      commit('setToken', data.token)
      return data;
    })
}

export function logout({commit}) {
  return axiosClient.post('/v1/logout')
    .then((response) => {
      commit('setToken', null)

      return response;
    })
}

export function getCountries({commit}) {
  return axiosClient.get('countries')
    .then(({data}) => {
      commit('setCountries', data)
    })
}

export function getUserTasks({commit, state}, {url = null, search = '', per_page, sort_field, sort_direction} = {}) {
  commit('setUserTasks', [true])
  url = url || '/UserTasks'
  const params = {
    per_page: state.UserTasks.limit,
  }
  return axiosClient.get(url, {
    params: {
      ...params,
      search, per_page, sort_field, sort_direction
    }
  })
    .then((response) => {
      commit('setUserTasks', [false, response.data])
    })
    .catch(() => {
      commit('setUserTasks', [false])
    })
}

export function getUserTasks({commit}, id) {
  return axiosClient.get(`/UserTasks/${id}`)
}

export function getTasks({commit, state}, {url = null, search = '', per_page, sort_field, sort_direction} = {}) {
  commit('setTasks', [true])
  url = url || '/Tasks'
  const params = {
    per_page: state.tasks.limit,
  }
  return axiosClient.get(url, {
    params: {
      ...params,
      search, per_page, sort_field, sort_direction
    }
  })
    .then((response) => {
      commit('setTasks', [false, response.data])
    })
    .catch(() => {
      commit('setTasks', [false])
    })
}

export function getTaks({commit}, id) {
  return axiosClient.get(`/v1/Tasks/${id}`)
}

export function createTaks({commit}, Taks) {
  if (Taks.image instanceof File) {
    const form = new FormData();
    form.append('name', Taks.name);
    form.append('description', Taks.description || '');
    form.append('due_date', Taks.due_date);
    form.append('status_id', Taks.status_id);
    Taks = form;
  }
  return axiosClient.post('/v1/Tasks', Taks)
}

export function deleteTaks({commit}, id) {
  return axiosClient.delete(`/v1/Tasks/${id}`)
}

export function getUsers({commit, state}, {url = null, search = '', per_page, sort_field, sort_direction} = {}) {
  commit('setUsers', [true])
  url = url || '/users'
  const params = {
    per_page: state.users.limit,
  }
  return axiosClient.get(url, {
    params: {
      ...params,
      search, per_page, sort_field, sort_direction
    }
  })
    .then((response) => {
      commit('setUsers', [false, response.data])
    })
    .catch(() => {
      commit('setUsers', [false])
    })
}

export function createUser({commit}, user) {
  return axiosClient.post('/users', user)
}

export function updateUser({commit}, user) {
  return axiosClient.put(`/v1/users/${user.id}`, user)
}

export function getEmployees({commit, state}, {url = null, search = '', per_page, sort_field, sort_direction} = {}) {
  commit('setEmployees', [true])
  url = url || '/Employees'
  const params = {
    per_page: state.Employees.limit,
  }
  return axiosClient.get(url, {
    params: {
      ...params,
      search, per_page, sort_field, sort_direction
    }
  })
    .then((response) => {
      commit('setEmployees', [false, response.data])
    })
    .catch(() => {
      commit('setEmployees', [false])
    })
}

export function getCustomer({commit}, id) {
  return axiosClient.get(`/Employees/${id}`)
}

export function createCustomer({commit}, customer) {
  return axiosClient.post('/Employees', customer)
}

export function updateCustomer({commit}, customer) {
  return axiosClient.put(`/Employees/${customer.id}`, customer)
}

export function deleteCustomer({commit}, customer) {
  return axiosClient.delete(`/Employees/${customer.id}`)
}

export function updateTaks({commit}, Taks) {
  const id = Taks.id
  if (Taks.image instanceof File) {
    const form = new FormData();
    form.append('id', Taks.id);
    form.append('name', Taks.name);
    form.append('description', Taks.description || '');
    form.append('due_date', Taks.due_date);
    form.append('status_id', Taks.price);
    form.append('_method', 'PUT');
    Taks = form;
  } else {
    Taks._method = 'PUT'
  }
  return axiosClient.post(`/v1/Tasks/${id}`, Taks)
}

