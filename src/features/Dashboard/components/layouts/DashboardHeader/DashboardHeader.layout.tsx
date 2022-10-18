import React, { FC, useEffect, useState } from "react";
import { routePaths } from "@/config";
import { useLocation, useNavigate } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect, ConnectedProps } from "react-redux";
import { Icon } from "@iconify/react";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import Zoom from "@mui/material/Zoom";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import "./DashboardHeader.styles.scss";
import CCartModal from "../../Conainers/CartModal/CartModal.container";
import { selectItemsBasket } from "@/store/reducers/items/items.selector";

const menuItems = [
  {
    name: "Page d'accueil",
    path: routePaths.home,
    icon: <HomeIcon color="primary" />,
  },
  // {
  //   name: "Espace administrateur",
  //   path: routePaths.admin,
  //   icon: <Icon color="var(--ui-green-normal)" icon="uit:create-dashboard" />,
  //   admin: true,
  // },
  {
    name: "Louer du matériel",
    path: routePaths.location,
    icon: (
      <Icon
        color="var(--ui-blue-normal)"
        icon="healthicons:rdt-result-out-stock-outline"
        fontSize={20}
      />
    ),
  },
];

type DashboardHeaderProps = ConnectedProps<typeof connector>;
const DashboardHeader: FC<DashboardHeaderProps> = ({ basket }) => {
  let location = useLocation();
  let navigate = useNavigate();
  let { pathname } = useLocation();

  const [openCart, setOpenCart] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [basketEmpty, setBasketEmpty] = useState<boolean>(false);
  const [showBasket, setShowBasket] = useState<boolean>(false);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    if (Object.keys(basket).length > 0) {
      setBasketEmpty(false);
    } else {
      setBasketEmpty(true);
    }
  }, [basket]);

  useEffect(() => {
    if (pathname.includes(routePaths.locationList)) {
      setShowBasket(true);
    } else {
      setShowBasket(false);
    }
  }, [pathname]);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderTitle = () => {
    // switch (location.pathname) {
    //   case routePaths.admin:
    //     return "Espace administrateur";
    //   case routePaths.location:
    //     return "Louer du matériel";
    // }
    if (location.pathname.includes(routePaths.admin)) {
      return "Espace administrateur";
    } else if (location.pathname.includes(routePaths.location)) {
      return "Louer du matériel";
    }
  };

  const filteredMenuList = menuItems.filter((elt) => {
    let alterCondition = true;
    // if (elt?.admin) alterCondition = user?.admin === 1;
    if (location.pathname !== routePaths.home)
      return (
        (!location.pathname.includes(elt.path) && alterCondition) ||
        elt.path === routePaths.home
      );
    else {
      return elt.path !== routePaths.home;
    }
  });

  return (
    <div className="l-dashboard-header">
      <div className="content">
        <Tooltip title="Menu">
          <IconButton
            className="menu-button"
            aria-label="Menu"
            onClick={handleMenuButtonClick}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
              e.preventDefault()
            }
            aria-controls={openMenu ? "navigation-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="navigation-menu"
          open={openMenu}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              minWidth: 220,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                left: 14,
                width: 10,
                height: 10,
                bgcolor: "#fff",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          {filteredMenuList.map((elt, idx) => {
            return (
              <div key={`navigation-item-${idx}`}>
                <MenuItem
                  onClick={() => {
                    navigate(elt.path);
                    handleMenuClose();
                  }}
                >
                  <ListItemIcon>{elt.icon}</ListItemIcon>
                  {elt.name}
                </MenuItem>
                {idx < filteredMenuList.length - 2 && <Divider />}
              </div>
            );
          })}
        </Menu>
        <span className="title">{renderTitle()}</span>
        <Zoom in={showBasket}>
          <Tooltip title={"Ouvrir le panier"} placement="left">
            <IconButton
              className="cart-button"
              aria-label="cart"
              onClick={() => {
                setOpenCart(true);
              }}
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                e.preventDefault()
              }
              color="primary"
            >
              <Badge color="error" variant="dot" invisible={basketEmpty}>
                <ShoppingCartIcon fontSize="medium" />
              </Badge>
            </IconButton>
          </Tooltip>
        </Zoom>
      </div>
      <CCartModal
        open={openCart}
        handleClose={() => {
          setOpenCart(false);
        }}
      />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  basket: selectItemsBasket,
});

const connector = connect(mapStateToProps);

export default connector(DashboardHeader);
