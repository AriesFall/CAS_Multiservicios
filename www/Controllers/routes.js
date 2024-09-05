//Declare environment
const local_server = "https://localhost:44354/api/auth/"                         //Write localhost and port
const public_server = "https://escrileapi.bsite.net/api/auth/"                        //Write WEB API public address
const local_sources = ""       //Write App local resources

const env = local_server                                  //Select your environment (local or public server)

//Login API
const login_route = env + "login"

//Create account API
const createaccount_route = env + "register"

//Obtener el nombre del porfesor
const getProfessorName_route = env + "nombrePorCorreo/"

//Mostrar clases
const showClasses_route = env + "mostrarClases"

//Crear clase API
const createClass_route = env + "crearClase"

//Unirse a una clase
const joinClass_route = env + "unirseClase"

//Mostrar clases creadas
const showCreatedClasses_route = env + "clasesCreadas"

//Mostar clase por id
const showClassWithId_route = env + "clase/"

//Editar clase por id
const editClass_route = env + "editarClase/"

//Eliminar clase por id
const deleteClass_route = env + "eliminarClase/"

//Salir de la clase
const leaveClass_route = env + "salirClase/"

//Mostrar usuarios
const showUsers_route = env + "users"

//Mostrar usuarios por id
const showUserWithId_route = env + "usuario/"

//Editar usuario por id
const editUserWithId_route = env + "editarUsuario/"

//Eliminar usuario por id
const deleteUserWithId_route = env + "eliminarUsuario/"

//Mostrar unidades
const showUnits_route = env + "mostrarUnidades"

//Mostrar actividades de ActiviadEstados
const showActivities_route = env + "mostrarActividadEstados"

//Mostrar Activiad de Unidad
const showActivitiesUnit_route = env + "actividadesPorClaseYAlumno"

//Mostrar Actividades de estados por correo y id
const showActivitiesStates_route = env + "actividadEstadoPorClaseYAlumno"

//Marcar una actividad
const markActivity_route = env + "actualizarActividadEstado"

//Asignar actividad
const assignActivity_route = env + "asignarActividad"

//Users API
const allUsers_route = env + "Users"
const postUser_route = env + "Users/"
const loginUser_route = env + "Users/login"
const editProfileFile_route = env + "Users/putProfileFile/"
const signupUser_route = env + "Users/signup"
const dataUser_route = env + "Users/"
const totalUser_route = env + "Users/GetTotalUsers"