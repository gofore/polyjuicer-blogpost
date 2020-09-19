import 'bootstrap/dist/css/bootstrap.min.css';
import credentialsJson from './credentials.json';
import { IUser } from './models/User';
import { ICredentials } from './models/Credentials';
import { UserSwitcher } from './UserSwitcher';

$(document).ready(() => {
    fillDropdownWithCredentials();
    registerSwitchButtonHandler();
    registerDropdownSelectHandler();
    handleUsernameDropdownSelect(); // initialize with top item
});

function handleUserSwitch(user: IUser) {
    const switcher = new UserSwitcher(user);
    return switcher.execute()
        .then(() => showSuccess(true))
        .catch((error: string) => {
            console.error('err ', error);
            showSuccess(false);
        });
}

function fillDropdownWithCredentials() {
    credentialsJson.creds.forEach((creds: ICredentials) => {
        creds.users.forEach((user: IUser) => {
            user.customer = creds.customer;
            $('#username_selector').append(`<option value='${JSON.stringify(user)}'>${user.username}</option>`);
        });
    });
}

function registerDropdownSelectHandler() {
    $('#username_selector').change(() => {
        handleUsernameDropdownSelect();
    });
}

function registerSwitchButtonHandler() {
    $('#switch-btn').click(() => {
        const val = $('#username_selector').val();
        const user = JSON.parse(val as string) as IUser;
        handleUserSwitch(user);
    });
}

function handleUsernameDropdownSelect() {
    $('#selected_user_info_area #detail_roles').empty();
    $('#notification_area').hide();
    const val = String($('#username_selector option:selected').val());
    const user = JSON.parse(val) as IUser;
    $('#selected_user_info_area #detail_customer').text(user.customer);
    user.roles.forEach((role: string) => {
        $('#selected_user_info_area #detail_roles').append(`<li>${role}</li>`);
    });
}

function showSuccess(success: boolean) {
    $('#notification_area').show();
    if (success) {
        $('#notification_area .alert-success').show();
    } else {
        $('#notification_area .alert-danger').show();
    }
}
