const GLOBALS = require('../../../config/constants');
const common = require('../../../config/common');
const con = require('../../../config/database');


const user_model = {

    /*
     ** Function for use signup
     */

    signup: function (request, callback) {
        let signupObj = {
            name: request.name,
            phone: request.phone,
            email: request.email,
            role: request.role,
            country_code: request.country_code,
            password: request.password
        }

        user_model.checkUniqueEmail(request, '', (userdetail) => {

            if (userdetail != null && request.email == userdetail.email) {
                callback('0', {
                    keyword: 'There is already an account registered with this email address',
                    components: {}
                }, null);
            } else {
                common.singleInsert('user', signupObj, (user_id, error) => {
                    user_model.getUserDetails(user_id, (userdata) => {

                        if (!error) {
                            callback('1', {
                                keyword: 'User Register Successfully',
                                components: {}
                            }, userdata);
                        } else {
                            callback('0', {
                                keyword: 'Faild to register',
                                components: {}
                            })
                        }
                    })


                });
            }
        });



    },
    /**
     * Login user
     */
    login: function (request, callback) {


        common.common_Singleselect(`select * from user where email='` + request.email + `' and password='` + request.password + `'`, function (user) {
            console.log(user,)
            if (user != null) {
                user.token = request.token

                callback('1', { keyword: 'User login successfully', components: {} }, user)

            }

            else {
                callback('0', { keyword: 'Invalid credintial', components: {} })
            }

        })
    },
    /*
    ** Function to check unique email, phone number and username use
    */
    checkUniqueEmail: function (request, login_user_id, callback) {
        // AND role = '${request.role}'
        common.common_Singleselect(`SELECT * FROM user WHERE  email = '${request.email}' AND is_deleted = '0' and role='` + request.role + `'`, (userdetail) => {
            if (userdetail != null) {
                callback(userdetail);
            } else {
                callback(null);
            }
        });

    },

    /*
     ** Function to get user details
     */
    getUserDetails: function (user_id, callback) {
        common.common_Singleselect(`select id as user_id, name,email,phone,country_code from user where is_deleted='0' and id=` + user_id + ``, (userDetails, error) => {
            if (userDetails == null) {
                callback(null);
            } else {
                callback(userDetails);
            }
        });
    },
    /**
     * 
     getcategory
     */
    getcategory: function (request, callback) {
        common.common_Multipleselect(`select name,image,description from category where is_deleted='0'`, (categorydata, error) => {
            // console.log(categorydata)
            if (categorydata == null) {
                callback('0', { keyword: 'Category list not found', components: {} }, categorydata)
            } else {
                callback('1', { keyword: 'Category list', components: {} }, categorydata)
            }
        });
    },
    /**
     *add book
     */
    addbook: function (request, callback) {
        if (request.role == 'author') {
            var addparams = {
                title: request.title,
                description: request.description,
                filename: request.filename,
                author_id: request.author_id,
                category_id: request.category_id,
                is_publish: request.is_publish,

            }
            if (request.is_publish == 1) {
                addparams.publish_date = request.publish_date
            } if (request.filename != undefined) {
                addparams.filename = request.filename
            }
            common.singleInsert('book', addparams, (data) => {
                if (data == null) {
                    callback('0', { keyword: 'Book add faild', components: {} },)
                } else {
                    callback('1', { keyword: 'Book added successfully', components: {} },)

                }
            });

        } else {
            callback('0', { keyword: 'Only author can add book', components: {} })
        }
    },
    /**
     * delete book
     */
    deletebook: function (request, callback) {
        updparams = {
            is_deleted: 1
        }
        common.singleUpdate('book', updparams, 'id=' + request.book_id + '', (bookdetails) => {
            if (bookdetails != null) {
                callback('1', { keyword: 'Book deleted successfully', components: {} }, null)
            } else {
                callback('0', { keyword: 'Sql error', components: {} }, null)

            }
        })
    },
    /**
 *updateb books
 */
    updatebook: function (request, callback) {
        var updparam = {
            title: request.title,
            description: request.description,
            filename: request.filename,
            author_id: request.author_id,
            category_id: request.category_id,
            is_publish: request.is_publish,

        }
        if (request.is_publish == 1) {
            updparam.publish_date = request.publish_date
        }
        else if (request.filename != undefined) {
            updparam.filename = request.filename
        }
        common.singleUpdate('book', updparam, 'id=' + request.book_id + '', (bookdetails) => {
            if (bookdetails != null) {
                callback('1', { keyword: 'Book updated successfully', components: {} }, null)
            } else {
                callback('0', { keyword: 'Sql error', components: {} }, null)

            }
        })

    },

    /*
    function to get book details
    */
    getbooklist: function (request, callback) {
        var condition = '';
        if (request.category_id != undefined) {
            condition += 'and category_id=' + request.category_id + ''
        }
        common.common_Multipleselect(`select title,filename,description,rating from book where is_deleted='0' ` + condition + ` order by rating desc`, (bookdetails) => {
            if (bookdetails != null) {
                callback('1', { keyword: 'Book details', componets: {} }, bookdetails)
            } else {
                callback('0', { keyword: 'SQL err', componets: {} }, null)
            }
        })
    },

    /**
       *addcomment
       */
    addcomment: function (request, callback) {
        var addparams = {
            user_id: request.user_id,
            comment: request.comment,
            book_id: request.book_id,

        }

        common.singleInsert('comment', addparams, (data) => {
            if (data == null) {
                callback('0', { keyword: 'comment add faild', components: {} },)
            } else {
                callback('1', { keyword: 'comment added successfully', components: {} },)

            }
        });
    },
    addrating: function (request, callback) {
        var addrating = {
            rating: request.rating,
            book_id: request.book_id,
            user_id: request.user_id

        }
        common.singleInsert('rating', addrating, (data) => {


            if (data == null) {
                callback('0', { keyword: 'rating add faild', components: {} },)
            } else {
                con.query(`select avg(rating) as rating from rating where book_id=${request.book_id} and is_deleted='0'`, function (err, rating) {
                    if (err) {
                        callback('0', { keyword: 'Sql error', components: {} }, null)
                    } else {
                        console.log(rating)
                        var updparams = { rating: rating[0].rating }

                        common.singleUpdate('book', updparams, 'id='+request.book_id+'', (data) => {
                            
                            callback('1', { keyword: 'rating added successfully', components: {} }, )
                        })

                    }
                })

            }
        })
    }


}

module.exports = user_model;