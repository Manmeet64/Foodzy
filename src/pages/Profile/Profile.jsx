import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";
import {
    Box,
    Container,
    Typography,
    Button,
    Avatar,
    TextField,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Grid,
} from "@mui/material";
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Edit as EditIcon,
    ExitToApp as SignOutIcon,
    ShoppingBag as ShoppingBagIcon,
    LocationOn as LocationIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../../firebase.js";
import styles from "./Profile.module.css";
import Navbar from "../../components/Navbar/Navbar";

function Profile() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const idToken = useFirebaseIdToken();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = window.innerWidth <= 768;
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const menuItems = [
        { id: "profile", icon: <PersonIcon />, label: "My Profile" },
        { id: "orders", icon: <ShoppingBagIcon />, label: "My Orders" },
        {
            id: "signout",
            icon: <SignOutIcon />,
            label: "Sign Out",
            color: "#e74c3c",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            x: 10,
            transition: { duration: 0.3, ease: "easeIn" },
        },
    };

    useEffect(() => {
        if (idToken) {
            fetchUserProfile();
        }
    }, [idToken]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/auth/find", {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                const userData = {
                    ...result.data,
                    profilePicture: result.data.profilePicture || null,
                };
                setUser(userData);
                setEditedUser(userData);
            } else {
                toast.error(result.message || "Failed to fetch user data.");
            }
        } catch (error) {
            toast.error("Error fetching profile");
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setEditedUser({ ...user });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setEditedUser((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setEditedUser((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleAddressChange = (e, index) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            address: prev.address.map((addr, i) =>
                i === index ? { ...addr, [name]: value } : addr
            ),
        }));
    };

    const handleSave = async () => {
        try {
            const dataToUpdate = {
                name: editedUser.name,
                phone: editedUser.phone,
                address: editedUser.address,
            };

            const response = await fetch("http://localhost:8000/auth/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to update profile"
                );
            }

            const result = await response.json();
            setUser(result.data);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.message || "Error updating profile");
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate("/signin");
            toast.success("Successfully signed out.");
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    const handleMenuClick = (menuId) => {
        if (menuId === "signout") {
            handleSignOut();
        } else if (menuId === "orders") {
            setActiveTab("orders");
            fetchOrders();
        } else {
            setActiveTab(menuId);
        }
        setIsMobileMenuOpen(false);
    };
    const fetchOrders = async () => {
        try {
            setOrdersLoading(true);
            const response = await fetch("http://localhost:8000/orders/user", {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setOrders(data.orders);
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Error loading orders");
        } finally {
            setOrdersLoading(false);
        }
    };

    const pageVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                Loading profile...
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.profileContainer}>
                <Grid container spacing={0}>
                    {isMobile && (
                        <IconButton
                            className={styles.mobileMenuButton}
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Grid item xs={12} md={3}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`${styles.sidebar} ${
                                isMobile ? styles.mobileSidebar : ""
                            }`}
                        >
                            <div className={styles.sidebarContent}>
                                <div className={styles.logoSection}>
                                    <Typography
                                        variant="h6"
                                        className={styles.brandName}
                                    >
                                        Foodzy
                                    </Typography>
                                </div>
                                <List className={styles.menuList}>
                                    {menuItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <ListItem
                                                button
                                                onClick={() =>
                                                    handleMenuClick(item.id)
                                                }
                                                className={`${
                                                    styles.menuItem
                                                } ${
                                                    activeTab === item.id
                                                        ? styles.activeMenuItem
                                                        : ""
                                                }`}
                                                style={{ color: item.color }}
                                            >
                                                <ListItemIcon
                                                    className={styles.menuIcon}
                                                    style={{
                                                        color: item.color,
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.label}
                                                />
                                            </ListItem>
                                        </motion.div>
                                    ))}
                                </List>
                            </div>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={9}>
                        <Container className={styles.mainContent}>
                            <AnimatePresence mode="wait">
                                {activeTab === "profile" && (
                                    <motion.div
                                        key="profile"
                                        variants={pageVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        {!isEditing ? (
                                            <Paper
                                                className={styles.profileCard}
                                            >
                                                <div
                                                    className={
                                                        styles.profileContent
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.profileHeader
                                                        }
                                                    >
                                                        <Avatar
                                                            src={
                                                                user?.profilePicture ||
                                                                "https://via.placeholder.com/150"
                                                            }
                                                            className={
                                                                styles.avatar
                                                            }
                                                        />
                                                        <h2
                                                            className={
                                                                styles.userName
                                                            }
                                                        >
                                                            {`${user?.name?.firstName} ${user?.name?.lastName}`}
                                                        </h2>
                                                    </div>

                                                    <div
                                                        className={
                                                            styles.infoSection
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.infoCard
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    styles.infoItem
                                                                }
                                                            >
                                                                <EmailIcon
                                                                    className={
                                                                        styles.infoIcon
                                                                    }
                                                                />
                                                                <div
                                                                    className={
                                                                        styles.infoContent
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.infoLabel
                                                                        }
                                                                    >
                                                                        Email
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            styles.infoValue
                                                                        }
                                                                    >
                                                                        {
                                                                            user?.email
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.infoItem
                                                                }
                                                            >
                                                                <PhoneIcon
                                                                    className={
                                                                        styles.infoIcon
                                                                    }
                                                                />
                                                                <div
                                                                    className={
                                                                        styles.infoContent
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.infoLabel
                                                                        }
                                                                    >
                                                                        Phone
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            styles.infoValue
                                                                        }
                                                                    >
                                                                        {
                                                                            user?.phone
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {user?.address?.map(
                                                                (
                                                                    addr,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={
                                                                            styles.infoItem
                                                                        }
                                                                    >
                                                                        <LocationIcon
                                                                            className={
                                                                                styles.infoIcon
                                                                            }
                                                                        />
                                                                        <div
                                                                            className={
                                                                                styles.infoContent
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.infoLabel
                                                                                }
                                                                            >
                                                                                Address{" "}
                                                                                {index +
                                                                                    1}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.infoValue
                                                                                }
                                                                            >
                                                                                {`${addr.street}, ${addr.city}`}
                                                                                <br />
                                                                                {`${addr.state} ${addr.postalCode}`}
                                                                                <br />
                                                                                {
                                                                                    addr.country
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="contained"
                                                        startIcon={<EditIcon />}
                                                        onClick={
                                                            handleEditToggle
                                                        }
                                                        className={
                                                            styles.editButton
                                                        }
                                                    >
                                                        Edit Profile
                                                    </Button>
                                                </div>
                                            </Paper>
                                        ) : (
                                            <Paper className={styles.editForm}>
                                                <div
                                                    className={
                                                        styles.editFormHeader
                                                    }
                                                >
                                                    <Typography
                                                        variant="h5"
                                                        className={
                                                            styles.editTitle
                                                        }
                                                    >
                                                        Edit Profile
                                                    </Typography>
                                                </div>
                                                <div
                                                    className={
                                                        styles.formFields
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.formSection
                                                        }
                                                    >
                                                        <TextField
                                                            label="First Name"
                                                            name="name.firstName"
                                                            value={
                                                                editedUser?.name
                                                                    ?.firstName ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className={
                                                                styles.textField
                                                            }
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            label="Last Name"
                                                            name="name.lastName"
                                                            value={
                                                                editedUser?.name
                                                                    ?.lastName ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className={
                                                                styles.textField
                                                            }
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                    </div>
                                                    <TextField
                                                        label="Email"
                                                        type="email"
                                                        value={
                                                            editedUser?.email ||
                                                            ""
                                                        }
                                                        disabled
                                                        className={
                                                            styles.textField
                                                        }
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        label="Phone"
                                                        name="phone"
                                                        value={
                                                            editedUser?.phone ||
                                                            ""
                                                        }
                                                        onChange={handleChange}
                                                        className={
                                                            styles.textField
                                                        }
                                                        fullWidth
                                                    />

                                                    <Typography
                                                        variant="h6"
                                                        className={
                                                            styles.sectionTitle
                                                        }
                                                    >
                                                        Address
                                                    </Typography>

                                                    {editedUser?.address?.map(
                                                        (addr, index) => (
                                                            <div
                                                                key={index}
                                                                className={
                                                                    styles.addressSection
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    className={
                                                                        styles.addressTitle
                                                                    }
                                                                >
                                                                    Address{" "}
                                                                    {index + 1}
                                                                </Typography>
                                                                <div
                                                                    className={
                                                                        styles.formSection
                                                                    }
                                                                >
                                                                    <TextField
                                                                        label="Street"
                                                                        name="street"
                                                                        value={
                                                                            addr.street ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleAddressChange(
                                                                                e,
                                                                                index
                                                                            )
                                                                        }
                                                                        className={
                                                                            styles.textField
                                                                        }
                                                                        fullWidth
                                                                    />
                                                                    <TextField
                                                                        label="City"
                                                                        name="city"
                                                                        value={
                                                                            addr.city ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleAddressChange(
                                                                                e,
                                                                                index
                                                                            )
                                                                        }
                                                                        className={
                                                                            styles.textField
                                                                        }
                                                                        fullWidth
                                                                    />
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles.formSection
                                                                    }
                                                                >
                                                                    <TextField
                                                                        label="State"
                                                                        name="state"
                                                                        value={
                                                                            addr.state ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleAddressChange(
                                                                                e,
                                                                                index
                                                                            )
                                                                        }
                                                                        className={
                                                                            styles.textField
                                                                        }
                                                                        fullWidth
                                                                    />
                                                                    <TextField
                                                                        label="Postal Code"
                                                                        name="postalCode"
                                                                        value={
                                                                            addr.postalCode ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleAddressChange(
                                                                                e,
                                                                                index
                                                                            )
                                                                        }
                                                                        className={
                                                                            styles.textField
                                                                        }
                                                                        fullWidth
                                                                    />
                                                                </div>
                                                                <TextField
                                                                    label="Country"
                                                                    name="country"
                                                                    value={
                                                                        addr.country ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleAddressChange(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                    className={
                                                                        styles.textField
                                                                    }
                                                                    fullWidth
                                                                />
                                                            </div>
                                                        )
                                                    )}

                                                    <div
                                                        className={
                                                            styles.buttonGroup
                                                        }
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            onClick={handleSave}
                                                            className={
                                                                styles.saveButton
                                                            }
                                                        >
                                                            Save Changes
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={
                                                                handleEditToggle
                                                            }
                                                            className={
                                                                styles.cancelButton
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Paper>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === "orders" && (
                                    <motion.div
                                        key="orders"
                                        variants={pageVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={styles.ordersContainer}>
                                            <Typography
                                                variant="h4"
                                                className={styles.ordersTitle}
                                            >
                                                My Orders
                                            </Typography>

                                            {ordersLoading ? (
                                                <div className={styles.loading}>
                                                    <div
                                                        className={
                                                            styles.spinner
                                                        }
                                                    ></div>
                                                    Loading orders...
                                                </div>
                                            ) : orders.length > 0 ? (
                                                <div
                                                    className={
                                                        styles.ordersList
                                                    }
                                                >
                                                    {orders.map(
                                                        (order, index) => (
                                                            <motion.div
                                                                key={order._id}
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 20,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        index *
                                                                        0.1,
                                                                }}
                                                            >
                                                                <Paper
                                                                    className={
                                                                        styles.orderCard
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.orderHeader
                                                                        }
                                                                    >
                                                                        <div
                                                                            className={
                                                                                styles.orderInfo
                                                                            }
                                                                        >
                                                                            <Typography
                                                                                variant="h6"
                                                                                className={
                                                                                    styles.orderId
                                                                                }
                                                                            >
                                                                                Order
                                                                                #
                                                                                {order.orderId.slice(
                                                                                    0,
                                                                                    8
                                                                                )}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="body2"
                                                                                className={
                                                                                    styles.orderStatus
                                                                                }
                                                                            >
                                                                                Status:{" "}
                                                                                {order.status
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase() +
                                                                                    order.status.slice(
                                                                                        1
                                                                                    )}
                                                                            </Typography>
                                                                        </div>
                                                                        <Typography
                                                                            variant="h6"
                                                                            className={
                                                                                styles.orderTotal
                                                                            }
                                                                        >
                                                                            ₹
                                                                            {
                                                                                order.totalAmount
                                                                            }
                                                                        </Typography>
                                                                    </div>

                                                                    <div
                                                                        className={
                                                                            styles.orderItems
                                                                        }
                                                                    >
                                                                        {order.items.map(
                                                                            (
                                                                                item
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        item._id
                                                                                    }
                                                                                    className={
                                                                                        styles.orderItem
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        className={
                                                                                            styles.itemInfo
                                                                                        }
                                                                                    >
                                                                                        <img
                                                                                            src={
                                                                                                item.imageUrl
                                                                                            }
                                                                                            alt={
                                                                                                item.name
                                                                                            }
                                                                                            className={
                                                                                                styles.itemImage
                                                                                            }
                                                                                        />
                                                                                        <div
                                                                                            className={
                                                                                                styles.itemDetails
                                                                                            }
                                                                                        >
                                                                                            <Typography
                                                                                                variant="body1"
                                                                                                className={
                                                                                                    styles.itemName
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    item.name
                                                                                                }
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant="body2"
                                                                                                className={
                                                                                                    styles.itemCuisine
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    item.cuisine
                                                                                                }
                                                                                            </Typography>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className={
                                                                                            styles.itemPricing
                                                                                        }
                                                                                    >
                                                                                        <Typography variant="body2">
                                                                                            {
                                                                                                item.quantity
                                                                                            }{" "}
                                                                                            ×
                                                                                            ₹
                                                                                            {
                                                                                                item.price
                                                                                            }
                                                                                        </Typography>
                                                                                        <Typography
                                                                                            variant="body1"
                                                                                            className={
                                                                                                styles.itemTotal
                                                                                            }
                                                                                        >
                                                                                            ₹
                                                                                            {item.quantity *
                                                                                                item.price}
                                                                                        </Typography>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>

                                                                    <div
                                                                        className={
                                                                            styles.orderFooter
                                                                        }
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textSecondary"
                                                                        >
                                                                            Ordered
                                                                            on:{" "}
                                                                            {new Date(
                                                                                order.orderDate
                                                                            ).toLocaleDateString(
                                                                                "en-IN",
                                                                                {
                                                                                    day: "numeric",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                }
                                                                            )}
                                                                        </Typography>
                                                                    </div>
                                                                </Paper>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className={styles.noOrders}
                                                >
                                                    <Typography variant="h6">
                                                        No orders found
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Container>
                    </Grid>

                    <Drawer
                        anchor="left"
                        open={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                        className={styles.mobileDrawer}
                    >
                        <Box className={styles.drawerContent}>
                            <div className={styles.sidebarContent}>
                                <div className={styles.logoSection}>
                                    <Typography
                                        variant="h6"
                                        className={styles.brandName}
                                    >
                                        Foodzy
                                    </Typography>
                                </div>
                                <List className={styles.menuList}>
                                    {menuItems.map((item) => (
                                        <ListItem
                                            key={item.id}
                                            button
                                            onClick={() =>
                                                handleMenuClick(item.id)
                                            }
                                            className={`${styles.menuItem} ${
                                                activeTab === item.id
                                                    ? styles.activeMenuItem
                                                    : ""
                                            }`}
                                            style={{ color: item.color }}
                                        >
                                            <ListItemIcon
                                                className={styles.menuIcon}
                                                style={{ color: item.color }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.label}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Box>
                    </Drawer>
                </Grid>
            </div>
        </>
    );
}

export default Profile;
