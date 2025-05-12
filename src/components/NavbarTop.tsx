'use client';

import Link from "next/link";
import { Button, Dropdown, Navbar } from "flowbite-react";
import { ShoppingCartIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useCartStore } from "@/store/cartStore";

const NavbarTop = () => {
  const { data: session } = useSession();
  //@ts-ignore
  const isAdmin = session?.user && session.user.role === 'ADMIN';
  const { items } = useCartStore();

  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="/">
        <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Speed Merch</span>
      </Navbar.Brand>



      <div className="flex gap-2">
        {isAdmin ? (
          <Link href="/admin">
            <Button color="gray">Admin</Button>
          </Link>
        ) : (
          <>

            <Link href="/cart">


              <button type="button" className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-lime-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"data-testid="cart-button">
                <ShoppingCartIcon className='h-8 w-8' />

                <span className="sr-only">Notifications</span>
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900" data-testid="cart-count">{items.length}</div>
              </button>

            </Link>
          </>
        )}
        <Dropdown label={session ? session.user?.name : 'Guest'}  >
          {session ? (
            <Dropdown.Item onClick={() => signOut()}>
              Logout
            </Dropdown.Item>
          ) : (
            <Dropdown.Item>
              <Link href="/login">
                Login
              </Link>
            </Dropdown.Item>
          )}
        </Dropdown>

      </div>


    </Navbar>
  )
}

export default NavbarTop;